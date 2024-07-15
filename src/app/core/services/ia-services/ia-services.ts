import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RequestModel } from "../../models/request/request.model";
import { ResponseModel } from "../../models/response/response.model";


@Injectable({
  providedIn: 'root'
})

export class IaServices {

  api = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) { }

  codeConverter(body: RequestModel, OPENAI_API_KEY?: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    }
    return this.http.post<ResponseModel>(this.api, body, { headers });
  }

}