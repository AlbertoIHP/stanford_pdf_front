export class Project {
    public id: number
    public name: string
    public picture: string
    public description: string
    public user_id : string


    constructor()
    {
      this.id = 0
      this.name = ''
      this.picture = 'https://cdn.lynda.com/course/506926/506926-636238695730179167-16x9.jpg'
      this.description = ''
      this.user_id = ''
    }
}
