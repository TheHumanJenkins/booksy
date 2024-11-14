const Wreck = require('@hapi/wreck');

class GustoClient {
  constructor() {
    this.wreck = Wreck.defaults({
      baseUrl: 'https://api.gusto-demo.com/',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async authorize() {
    const { res, payload } = await this.wreck.post('/oauth/token', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      payload: {
        client_id: process.env.GUSTO_CLIENT_ID,
        client_secret: process.env.GUSTO_CLIENT_SECRET,
        grant_type: 'system_access'
      },
      json: 'strict'
    });

    if (res.statusCode !== 200) {
      throw Boom.unauthorized(
        "You are not authorized for Gusto's APIs, please check your client_id & client_secret."
      );
    }

    console.log("Successfully Authenticated with Gusto's APIs....");

    this.systemToken = `Bearer ${payload.access_token}`;
  }

  async createCompany(db) {
    const { response, payload } = await this.wreck.post(
      '/v1/partner_managed_companies',
      {
        headers: {
          Authorization: this.systemToken
        },
        payload: {
          user: {
            last_name: db.owner.lastName,
            first_name: db.owner.firstName,
            email: db.owner.email
          },
          company: {
            name: db.company.name
          }
        },
        json: 'strict'
      }
    );

    this.companyUUID = payload.company_uuid;

    this.companyToken = `Bearer ${payload.access_token}`;

    await this.wreck.post(`/v1/companies/${this.companyUUID}/locations`, {
      headers: {
        Authorization: this.companyToken
      },
      payload: {
        phone_number: '8009360383',
        street_1: '510 Jersey Ave',
        city: 'Jersey City',
        state: 'NJ',
        zip: '07302',
        country: 'USA',
        filing_address: true,
        mailing_address: true
      }
    });
  }

  async createEmployee(employee) {
    return this.wreck.post(`/v1/companies/${this.companyUUID}/employees`, {
      headers: {
        Authorization: this.companyToken
      },
      payload: {
        ...employee
      }
    });
  }

  async createCompanyOnboardingFlow() {
    const { res, payload } = await this.wreck.post(
      `/v1/companies/${this.companyUUID}/flows`,
      {
        headers: {
          Authorization: this.companyToken
        },
        payload: {
          flow_type: 'company_onboarding',
          entity_type: 'Company',
          entity_uuid: this.companyUUID
        }
      }
    );

    return payload;
  }
}

module.exports = GustoClient;
