import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { metaAPI } from '@/lib/metaAPI';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('meta_ads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      campaignName,
      objective,
      budget,
      startDate,
      endDate,
      targetAudience,
      headline,
      description,
      callToAction,
    } = body;

    let metaCampaignId = null;
    let metaStatus = 'Not Synced';

    // Try Meta API integration (optional)
    if (metaAPI.isConfigured()) {
      try {
        const metaObjective = metaAPI.mapObjectiveToMeta(objective);
        
        console.log('Creating Meta campaign with objective:', metaObjective);
        
        const metaCampaignResult = await metaAPI.createCampaign({
          name: campaignName,
          objective: metaObjective,
          status: 'PAUSED',
          special_ad_categories: [],
        });

        if (metaCampaignResult.success) {
          metaCampaignId = metaCampaignResult.data.id;
          metaStatus = 'Synced';
          console.log('✅ Meta campaign created successfully!');
          console.log('Campaign ID:', metaCampaignId);
          console.log('View at: https://business.facebook.com/adsmanager/manage/campaigns?act=' + process.env.META_AD_ACCOUNT_ID?.replace('act_', ''));
        } else {
          console.warn('❌ Meta API failed, saving to database only:', metaCampaignResult.error);
          metaStatus = 'Sync Failed';
        }
      } catch (metaError) {
        console.warn('Meta API error (non-fatal):', metaError);
        metaStatus = 'Sync Failed';
      }
    } else {
      console.log('Meta API not configured, saving locally only');
    }

    // Save to Supabase database
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('meta_ads')
      .insert([
        {
          campaign_name: campaignName,
          objective: objective,
          budget: parseFloat(budget),
          start_date: startDate,
          end_date: endDate || null,
          target_audience: targetAudience,
          headline: headline,
          description: description,
          call_to_action: callToAction,
          status: 'Active',
          meta_campaign_id: metaCampaignId,
          meta_sync_status: metaStatus,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Database connection failed. Please check your Supabase configuration in .env.local',
          details: error.hint || 'Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY are correct'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      metaSynced: metaStatus === 'Synced',
      metaCampaignId: metaCampaignId,
      message: metaStatus === 'Synced' 
        ? 'Campaign created and synced to Meta successfully' 
        : 'Campaign created in database',
    });
  } catch (error: any) {
    console.error('Error creating ad:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create ad campaign',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
