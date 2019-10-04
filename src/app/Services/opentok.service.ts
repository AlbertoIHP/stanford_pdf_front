import { Injectable } from '@angular/core';

import * as OT from '@opentok/client';
import config from '../../config';

@Injectable()
export class OpentokService
{

  session: OT.Session;
  token: string;

  constructor() { }

  getOT()
  {
    return OT;
  }

  initSession( tokenId, sessionId )
  {
    if (config.API_KEY)
    {
      this.session = this.getOT().initSession( config.API_KEY, sessionId );
      this.token = tokenId;
      return Promise.resolve(this.session);
    }
  }

  connect()
  {
    return new Promise((resolve, reject) => {
      this.session.connect(this.token, (err) => {
        if (err)
        {
          reject(err);
        }
        else
        {
          resolve(this.session);
        }
      })
    });
  }
}
