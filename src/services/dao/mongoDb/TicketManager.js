import ticketModel from "../../models/tickets.model.js";

export default class TicketManagerServices{
    constructor(){}

    createTicket = async (ticketInfo) => {
      try {
        const newTicket = await ticketModel.create(ticketInfo);
        return {message: "Ticket created successfully", ticket: newTicket};
      } catch (error) {
        console.error("request error: " + error);
        return {"message": "Ticket no created"};
      }
    }

}