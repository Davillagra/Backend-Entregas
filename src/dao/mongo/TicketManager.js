import { ticketModel } from "../../models/tickets.js"

export class TicketManager {
    constructor() {}
    newTicket = async (totPrice,email) => {
        try {
            const ticket = ticketModel.create({amount:totPrice,purchaser:email})
            return ticket
        } catch (error) {
            return error
        }
    }
}

export default TicketManager