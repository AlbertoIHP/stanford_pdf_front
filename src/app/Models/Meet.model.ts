export class Meet
{
    public id: number
    public name: string
    public videoconference: string
    public date: string
    public pupil_id: string
    public hour: string
    public minutes: string
    public didhappen: string
    public isactive: string
    public invitator: string
    public description: string
    public session_tok_id: string



    constructor()
    {
      this.id = 0
      this.name = ''
      this.videoconference = '1'
      this.date = ''
      this.pupil_id = ''
      this.hour = ''
      this.minutes = ''
      this.didhappen = '0'
      this.isactive = '0'
      this.invitator = ''
      this.description = ''
      this.session_tok_id = ''
    }
}
