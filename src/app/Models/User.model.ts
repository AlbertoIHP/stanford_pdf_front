export class User {
    public username: string
    public name: string
    public lastname: string
    public password: string
    public picture: string | ArrayBuffer
    public isActive: string
    public role: string
    public lastpasswordreset: string
    public enabled: number
    public authorities: any
    public description: string


    constructor()
    {
      this.username = ''
      this.name = ''
      this.lastname = ''
      this.password = ''
      this.picture = 'https://openclipart.org/download/247324/abstract-user-flat-1.svg'
      this.isActive = ''
      this.role = ''

      this.lastpasswordreset = ''
      this.enabled = 1
      this.authorities = [ { id: 0 } ]
      this.description = ''

    }
}
