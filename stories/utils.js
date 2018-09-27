import { storiesOf, addDecorator } from '@storybook/react'
import { withConsole } from '@storybook/addon-console'

export function getStoriesOf (name, config = []) {
  if (!name) throw new Error('please set the sroty name')
  const fn = storiesOf(name, module)
    .addDecorator((storyFn, context) => withConsole()(storyFn)(context))
  return config.reduce((a, { name, story }) => {
    return fn.add(name, story)
  }, fn)
}
