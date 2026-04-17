import axios from 'axios';

const META_API_BASE_URL = 'https://graph.facebook.com/v19.0';

interface MetaCampaignData {
  name: string;
  objective: string;
  status: string;
  special_ad_categories?: string[];
}

interface MetaAdSetData {
  name: string;
  campaign_id: string;
  daily_budget: number;
  billing_event: string;
  optimization_goal: string;
  bid_amount: number;
  targeting: any;
  start_time?: string;
  end_time?: string;
}

interface MetaAdCreativeData {
  name: string;
  object_story_spec?: any;
  degrees_of_freedom_spec?: any;
}

export class MetaMarketingAPI {
  private accessToken: string;
  private adAccountId: string;

  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN || '';
    this.adAccountId = process.env.META_AD_ACCOUNT_ID || '';
  }

  private async makeRequest(method: string, endpoint: string, data?: any) {
    try {
      const url = `${META_API_BASE_URL}${endpoint}`;
      const response = await axios({
        method,
        url,
        params: {
          access_token: this.accessToken,
        },
        data,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Meta API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async createCampaign(campaignData: MetaCampaignData) {
    const endpoint = `/${this.adAccountId}/campaigns`;
    const campaignPayload = {
      ...campaignData,
      is_adset_budget_sharing_enabled: false,
    };
    return this.makeRequest('POST', endpoint, campaignPayload);
  }

  async getCampaigns() {
    const endpoint = `/${this.adAccountId}/campaigns`;
    const params = {
      fields: 'id,name,objective,status,created_time,updated_time',
      access_token: this.accessToken,
    };
    
    try {
      const response = await axios.get(`${META_API_BASE_URL}${endpoint}`, { params });
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Meta API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async createAdSet(adSetData: MetaAdSetData) {
    const endpoint = `/${this.adAccountId}/adsets`;
    return this.makeRequest('POST', endpoint, adSetData);
  }

  async createAdCreative(creativeData: MetaAdCreativeData) {
    const endpoint = `/${this.adAccountId}/adcreatives`;
    return this.makeRequest('POST', endpoint, creativeData);
  }

  mapObjectiveToMeta(objective: string): string {
    const objectiveMap: { [key: string]: string } = {
      'awareness': 'OUTCOME_AWARENESS',
      'traffic': 'OUTCOME_TRAFFIC',
      'engagement': 'OUTCOME_ENGAGEMENT',
      'leads': 'OUTCOME_LEADS',
      'sales': 'OUTCOME_SALES',
    };
    return objectiveMap[objective] || 'OUTCOME_TRAFFIC';
  }

  isConfigured(): boolean {
    return !!(this.accessToken && this.adAccountId && 
              this.accessToken !== 'your_test_access_token_here' &&
              this.adAccountId !== 'act_your_ad_account_id_here');
  }
}

export const metaAPI = new MetaMarketingAPI();
