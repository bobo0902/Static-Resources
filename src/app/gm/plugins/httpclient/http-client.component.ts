import { OnInit } from '@angular/core';
import { HttpClientService } from './http-client.service';
export class HttpClientComponent implements OnInit {
  constructor(httpClientService: HttpClientService) { }
  ngOnInit(): void { }
}
