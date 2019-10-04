export class DistributionUser {
    public id: number
    public user_id: string
    public distribution_id: string
    public isowner: string


    constructor()
    {
      this.id = 0
      this.user_id = ''
      this.distribution_id = ''
      this.isowner = '0'
    }
}
