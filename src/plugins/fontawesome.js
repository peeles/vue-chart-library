import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import icons as needed
import {
    faChartBar,
    faChartLine,
    faChartPie,
    faCompress,
    faDownload,
    faExpand,
    faInfoCircle,
    faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'

// Add icons to library
library.add(
    faInfoCircle,
    faExpand,
    faCompress,
    faDownload,
    faQuestionCircle,
    faChartBar,
    faChartLine,
    faChartPie
)

/**
 * Install FontAwesome plugin
 * @param {Object} app - Vue app instance
 */
export default function installFontAwesome(app) {
    app.component('FontAwesomeIcon', FontAwesomeIcon)
}

export { FontAwesomeIcon }
