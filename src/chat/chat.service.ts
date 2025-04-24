import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  getWelcomeMessage(): string {
    return 'Welcome to the chat!';
  }
}
