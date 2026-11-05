import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { chatService } from 'src/services/api/message.service';

export class Message {
  public async conversation(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatService.getConversation(`${req.params.sendUsername}`, `${req.params.receiverUsername}`);
    res.status(StatusCodes.OK).json({ message: response.data.message, conversations: response.data.conversations });
  }

  public async message(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatService.addMessage(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: response.data.message, conversationId: response.data.conversationId, messageData: response.data.messageData });
  }

  public async messages(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatService.getMessages(`${req.params.senderUsername}`, `${req.params.receiverUsername}`);
    res.status(StatusCodes.OK).json({ message: response.data.message, messages: response.data.messages });
  }

  public async conversationList(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatService.getConversationList(`${req.params.username}`);
    res.status(StatusCodes.OK).json({ message: response.data.message, messages: response.data.messages });
  }

  public async userMessages(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatService.getUserMessage(`${req.params.conversationId}`);
    res.status(StatusCodes.OK).json({ message: response.data.message, messages: response.data.messages });
  }

  public async offer(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatService.updateOffer(req.body.messageId, req.body.type);
    res.status(StatusCodes.OK).json({ message: response.data.message, singleMessage: response.data.singleMessage });
  }

  public async markSingleMessage(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await chatService.markMessageAsRead(req.body.messageId);
    res.status(StatusCodes.OK).json({ message: response.data.message, singleMessage: response.data.singleMessage });
  }

  public async markMultipleMessages(req: Request, res: Response): Promise<void> {
    const { messageId, senderUsername, receiverUsername } = req.body;
    const response: AxiosResponse = await chatService.markMultipleMessagesAsRead(messageId, senderUsername, receiverUsername);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
