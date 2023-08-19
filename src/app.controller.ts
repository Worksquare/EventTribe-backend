/* eslint-disable prettier/prettier */
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';


const MESSAGE = 'Welcome to EventTribe Backend! Eventribe backend up and running';

@Controller()
export class AppController {

  @Get()
  getRoot(@Res() res: Response) {
    res.send(MESSAGE);
  }
}
