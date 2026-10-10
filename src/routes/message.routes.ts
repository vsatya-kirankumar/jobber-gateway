import express, { Router } from 'express';
import { Message } from 'src/controllers/message/message.controller';

class MessageRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get(
      '/message/conversation/:sendUsername/:receiverUsername',

      Message.prototype.conversation
    );
    this.router.get('/message/:sendUsername/:receiverUsername', Message.prototype.messages);
    this.router.get('/message/conversations/:username', Message.prototype.conversationList);
    this.router.get('/message/:conversationId', Message.prototype.userMessages);
    this.router.post('/message', Message.prototype.message);
    this.router.put('/message/offer', Message.prototype.offer);
    this.router.put('/message/mark-as-read', Message.prototype.markSingleMessage);
    this.router.put('/message/mark-multiple-as-read', Message.prototype.markMultipleMessages);

    return this.router;
  }
}

export const messageRoutes: MessageRoutes = new MessageRoutes();
