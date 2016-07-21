package salesforce

import controllers.Logging
import models.{Contact, SalesforceException}
import play.api.libs.json.{JsArray, JsResult}

/**
  * Created by in04468 on 29-06-2016.
  */
class SalesforceService(val salesforceDao: SalesforceDao) extends Logging{

  /**
    * Retrieves all the contacts from sales force
    *
    * @return A list of Json elements holding the contact details for retrieved
    *         customers from sales force
    */
  def getContacts : Seq[Contact] = {
    val queryStr = "select Id, FirstName, LastName, Email from Contact"
    log.debug("Querying sales force with: '" + queryStr + "'")
    var result:Seq[Contact] = Nil
    try {
      result = salesforceDao.query(queryStr).validate[Seq[Contact]].get
    } catch {
      case ex: SalesforceException => log.error("ERROR: " + ex.getMessage +"\nError Description: " + ex.getCause)
      case ex: Exception => log.error("ERROR: " + ex.getMessage +"\nError Description: " + ex.getCause)
    }
    log.debug("Got results : " + result.length)
    return result
  }

}
