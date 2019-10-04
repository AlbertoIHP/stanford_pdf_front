export class Message {
    public id: number
    public content : string
    public user_id: string
    public chat_id: string
    public distribution_id: string

    constructor()
    {
      this.id = 0
      this.content = ''
      this.user_id = ''
      this.chat_id = ''
      this.distribution_id = ''
    }
}
