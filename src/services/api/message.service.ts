import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios';
import { IMessageDocument } from '@vsatya-kirankumar/jobber-shared';
import axios, { AxiosResponse } from 'axios';

export let axiosChatInstance: ReturnType<typeof axios.create>;

class ChatService {
  constructor() {
    const axiosService: AxiosService = new AxiosService(`${config.MESSAGE_BASE_URL}/api/v1/message`, 'message');
    axiosChatInstance = axiosService.axios;
  }

  async getConversation(senderUsername: string, receiverUsername: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosChatInstance.get(`/conversation/${senderUsername}/${receiverUsername}`);
    return response;
  }

  async getMessages(senderUsername: string, receiverUsername: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosChatInstance.get(`/${senderUsername}/${receiverUsername}`);
    return response;
  }

  async getConversationList(username: string): Promise<AxiosResponse> {
    return await axiosChatInstance.get(`/conversations/${username}`);
  }

  async getUserMessage(conversationId: string): Promise<AxiosResponse> {
    return await axiosChatInstance.get(`/${conversationId}`);
  }

  async addMessage(body: IMessageDocument): Promise<AxiosResponse> {
    return await axiosChatInstance.post('/', body);
  }

  async updateOffer(messageId: string, type: string): Promise<AxiosResponse> {
    return await axiosChatInstance.put('/offer', { messageId, type });
  }

  async markMessageAsRead(messageId: string): Promise<AxiosResponse> {
    return axiosChatInstance.put('/mark-as-read', { messageId });
  }

  async markMultipleMessagesAsRead(senderUsername: string, receiverUsername: string, messageId: string): Promise<AxiosResponse> {
    return axiosChatInstance.put('/mark-multiple-as-read', { messageId, senderUsername, receiverUsername });
  }
}

export const chatService: ChatService = new ChatService();
