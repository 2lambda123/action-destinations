import { createTestEvent, createTestIntegration } from '@segment/actions-core'
import { generateTestData } from '../../../lib/test-data'
import destination from '../index'
import nock from 'nock'
import { dataFile } from '../trackEvent/__tests__/dataFile'

const testDestination = createTestIntegration(destination)
const destinationSlug = 'actions-optimizely-full-stack'

describe(`Testing snapshot for ${destinationSlug} destination:`, () => {
  for (const actionSlug in destination.actions) {
    it(`${actionSlug} action - required fields`, async () => {
      const seedName = `${destinationSlug}#${actionSlug}`
      const action = destination.actions[actionSlug]
      const [eventData, settingsData] = generateTestData(seedName, destination, action, true)

      dataFile.events[0].key = eventData.eventKey
      nock(settingsData.dataFileUrl)
        .persist()
        .get(/.*/)
        .reply(200, { ...dataFile })
      nock(/.*/).persist().post(/.*/).reply(200)
      nock(/.*/).persist().put(/.*/).reply(200)

      const event = createTestEvent({
        properties: eventData
      })

      const responses = await testDestination.testAction(actionSlug, {
        event: event,
        mapping: event.properties,
        settings: settingsData,
        auth: undefined
      })

      const request = responses[0].request
      const rawBody = await request.text()

      try {
        const json = JSON.parse(rawBody)
        expect(json).toMatchSnapshot()
        return
      } catch (err) {
        expect(rawBody).toMatchSnapshot()
      }

      expect(request.headers).toMatchSnapshot()
    })

    it(`${actionSlug} action - all fields`, async () => {
      const seedName = `${destinationSlug}#${actionSlug}`
      const action = destination.actions[actionSlug]
      const [eventData, settingsData] = generateTestData(seedName, destination, action, false)

      dataFile.events[0].key = eventData.eventKey
      nock(settingsData.dataFileUrl)
        .persist()
        .get(/.*/)
        .reply(200, { ...dataFile })
      nock(/.*/).persist().post(/.*/).reply(200)
      nock(/.*/).persist().put(/.*/).reply(200)

      const event = createTestEvent({
        properties: eventData
      })

      const responses = await testDestination.testAction(actionSlug, {
        event: event,
        mapping: event.properties,
        settings: settingsData,
        auth: undefined
      })

      const request = responses[0].request
      const rawBody = await request.text()

      try {
        const json = JSON.parse(rawBody)
        expect(json).toMatchSnapshot()
        return
      } catch (err) {
        expect(rawBody).toMatchSnapshot()
      }
    })
  }
})
