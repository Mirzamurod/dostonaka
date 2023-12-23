export type IProject = {
  /**
   * link
   */
  url: string
  method: 'get' | 'post' | 'put' | 'delete'
  data?: any
  params?: any
  onStart: string
  onSuccess: string
  onFail: string
}