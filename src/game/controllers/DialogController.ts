import { store } from '../state/store'
import { setDialogState, addToHistory } from '../state/dialogSlice'
import { AudioController } from './AudioController'

export class DialogController {
  static showDialog(content: string, character?: { name: string; image?: string }, choices?: { id: string; text: string }[]) {
    store.dispatch(setDialogState({
      content,
      character,
      choices,
      isVisible: true,
      isChat: false
    }))

    // 添加到对话历史
    store.dispatch(addToHistory({
      content,
      character
    }))

    // 播放对话音效
    AudioController.playUISound('select')
  }

  static hideDialog() {
    store.dispatch(setDialogState({
      content: '',
      character: undefined,
      choices: undefined,
      isVisible: false,
      isChat: false
    }))
  }

  static showChat(content: string) {
    store.dispatch(setDialogState({
      content,
      character: undefined,
      choices: undefined,
      isVisible: true,
      isChat: true
    }))

    // 添加到对话历史
    store.dispatch(addToHistory({
      content
    }))
  }

  static hideChat() {
    store.dispatch(setDialogState({
      content: '',
      character: undefined,
      choices: undefined,
      isVisible: false,
      isChat: false
    }))
  }
} 