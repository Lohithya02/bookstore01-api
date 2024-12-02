// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {get} from '@loopback/rest';
export class HomePageControllerController {
  constructor() {}
  @get('/')
  home() {
    return {
      message: 'Welcome to the Bookstore API!',
    };
  }
}

