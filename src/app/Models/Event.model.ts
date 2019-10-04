export class Event {
    public id: number
    public name : string
    public date: string
    public description: string
    public picture: string
    public calendar_id: string

    constructor()
    {
      this.id = 0
      this.name = ''
      this.date = ''
      this.description = ''
      this.picture = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtx4fbHDu8V_nJE7yRb8TigO11Cvwa__6t65gXSs-6estvk-jLQQ'
      this.calendar_id = ''
    }
}
