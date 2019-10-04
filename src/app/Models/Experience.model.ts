export class Experience {
    public id: number
    public name : string
    public description: string
    public picture: string
    public user_id: string

    constructor()
    {
      this.id = 0
      this.name = ''
      this.description = ''
      this.picture = 'http://tls.edu.pe/sites/default/files/ux.jpg'
      this.user_id = ''
    }
}
