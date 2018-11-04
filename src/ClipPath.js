import Container from './Container.js'
import {nodeOrNew, extend} from './tools.js'
import find from './selector.js'
//import {remove} from './Element.js'
import {register} from './adopter.js'
import {registerMethods} from './methods.js'

export default class ClipPath extends Container {
  constructor (node) {
    super(nodeOrNew('clipPath', node), ClipPath)
  }

  // Unclip all clipped elements and remove itself
  remove () {
    // unclip all targets
    this.targets().forEach(function (el) {
      el.unclip()
    })

    // remove clipPath from parent
    return super.remove()
    //return remove.call(this)
  }

  targets () {
    return find('svg [clip-path*="' + this.id() + '"]')
  }
}


registerMethods({
  Container: {
    // Create clipping element
    clip: function() {
      return this.defs().put(new ClipPath)
    }
  },
  Element: {
    // Distribute clipPath to svg element
    clipWith (element) {
      // use given clip or create a new one
      let clipper = element instanceof ClipPath
        ? element
        : this.parent().clip().add(element)

      // apply mask
      return this.attr('clip-path', 'url("#' + clipper.id() + '")')
    },

    // Unclip element
    unclip () {
      return this.attr('clip-path', null)
    },

    clipper () {
      return this.reference('clip-path')
    }
  }
})

register(ClipPath)
