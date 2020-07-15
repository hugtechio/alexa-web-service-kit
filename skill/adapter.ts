import * as Alexa from 'ask-sdk'
import * as Skill from './skill'
import { ExpressAdapter } from 'ask-sdk-express-adapter'
import verifier from './verifier'

export function getAdapter (): ExpressAdapter {
    const skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        Skill.LaunchRequestHandler,
        Skill.HelloWorldIntentHandler,
        Skill.HelpIntentHandler,
        Skill.CancelAndStopIntentHandler,
        Skill.SessionEndedRequestHandler,
      )
      .addErrorHandlers(Skill.ErrorHandler)
      .create();

  // 厳密なトークン検証をするためにデフォルトの検証はOFF
  const adapter = new ExpressAdapter(skill, false, false, [verifier]);
  return adapter
}