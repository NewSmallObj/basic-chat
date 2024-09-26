import { ConersationType, MessageType } from '@/hooks/useConversation'
import { create } from 'zustand'
import { cloneDeep } from "lodash"
import { DeviceEventEmitter } from 'react-native'
import { PUB_CONVERSATION_REFRESH } from '@/utils/stants'
import { fetchAddConversation, UserType } from '@/hooks/useAccount'
export interface ConversationStore {
	conversation: ConersationType[]
	setConversation: (conversation: ConversationStore['conversation']) => void
  addConversationMessage: (message: MessageType,user?:UserType) => void
}

const useConversationStore = create<ConversationStore>((set) => ({
	conversation: [],
	setConversation: (conversation) => set({ conversation }),
  addConversationMessage: (message,user) => set((state) => {
    const pre = cloneDeep(state.conversation)
    const index = pre.findIndex(item => item._id === message.conversationId)
    if(index !== -1){
      pre[index].lastMessage = message.body
			pre[index].lastMessageAt = message.createdAt
			pre[index].messages.push(message)
    }else{
      DeviceEventEmitter.emit(PUB_CONVERSATION_REFRESH)
    }
    return { conversation: [...pre] }
  })
}))

export default useConversationStore
