export class Notification {
    public id: number
    public notificationtype_id: string
    public user_id : string
    public content: string

    constructor()
    {
      this.id = 0
      this.user_id = ''
      this.notificationtype_id = ''
      this.content = ''
    }
}
