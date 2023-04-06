import { VisitorAttribute, Event, ProjectConfig } from '../types'
import reduceRight from 'lodash/reduceRight'

export function buildVisitorAttributes(
  configObj: ProjectConfig,
  userAttributes?: { [key: string]: unknown }
): VisitorAttribute[] {
  if (!userAttributes) return []
  const attributeKeyMap: Record<string, { id: string; key: string }> = reduceRight(
    configObj.attributes,
    (prev, curr) => {
      return Object.assign(prev, {
        [curr.key]: curr
      })
    },
    {}
  )

  return (
    Object.keys(userAttributes)
      .filter((key) => Object.prototype.hasOwnProperty.call(attributeKeyMap, key))
      // filter out keys with values of type 'object'
      .filter((key) => isValidValue(userAttributes[key]))
      .map((key) => ({
        entity_id: attributeKeyMap[key].id,
        key: key,
        value: userAttributes[key] as string | number | boolean,
        type: 'custom'
      }))
  )
}

export function getEventId(configObj: ProjectConfig, eventKey: string) {
  const eventMap: Record<string, Event> = reduceRight(
    configObj.events,
    (prev, curr) => {
      return Object.assign(prev, {
        [curr.key]: curr
      })
    },
    {}
  )
  if (eventMap[eventKey]) {
    return eventMap[eventKey].id
  }
}

function isValidValue(value: unknown) {
  return ['string', 'number', 'boolean'].includes(typeof value)
}