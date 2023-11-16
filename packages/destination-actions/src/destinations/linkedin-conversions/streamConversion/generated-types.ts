// Generated file. DO NOT MODIFY IT BY HAND.

export interface Payload {
  /**
   * A dynamic field dropdown which fetches all adAccounts.
   */
  adAccountId: string
  /**
   * Fetches a list of conversion rules given an ad account id.
   */
  conversionId?: string
  /**
   * Epoch timestamp in milliseconds at which the conversion event happened. If your source records conversion timestamps in second, insert 000 at the end to transform it to milliseconds.
   */
  conversionHappenedAt: number
  /**
   * The monetary value for this conversion. Example: {“currencyCode”: “USD”, “amount”: “50.0”}.
   */
  conversionValue?: {
    /**
     * ISO format
     */
    currencyCode: string
    /**
     * Value of the conversion in decimal string. Can be dynamically set up or have a fixed value.
     */
    amount: string
  }
  /**
   * Will be used for deduplication in future.
   */
  eventId?: string
  /**
   * The user(s) to associate this conversion to. `userId` array or `userInfo` combination is required.
   */
  user: {
    userIds: {
      idType: string
      idValue: string
    }[]
    userInfo?: {
      firstName?: string
      lastName?: string
      companyName?: string
      title?: string
      countryCode?: string
    }
  }
  /**
   * A dynamic field dropdown which fetches all active campaigns.
   */
  campaignId: string
}
