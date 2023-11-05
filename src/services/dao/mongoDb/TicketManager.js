import ticketModel from "../../models/tickets.model.js";
import CustomError from "../../errors/customError.js";
import { EErrors } from "../../errors/errors-enum.js";

export default class TicketManagerServices {
  constructor() {}

  createTicket = async (ticketInfo) => {
    try {
      const newTicket = await ticketModel.create(ticketInfo);

      if (!newTicket || !ticketInfo) {
        let statusCode = !newTicket ? 500 : 400;
        res.status(statusCode).send({
          payload: {
            message: !newTicket
              ? "Ticket no created"
              : "Ticket info is not provided",
            success: false,
          },
        });
        CustomError.createError({
          name: "Ticket not Created",
          message: "The Ticket could not be Created",
          code: !newTicket
            ? EErrors.INTERNAL_SERVER_ERROR
            : EErrors.INVALID_TYPES,
          cause: "The Ticket could not be Created",
        });
      }
      return newTicket;
    } catch (error) {
      req.logger.error(error.name, {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
    }
  };
}
