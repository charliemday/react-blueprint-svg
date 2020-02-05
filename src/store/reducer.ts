import { ActionType } from './actions'
import { RootState } from './state'
import * as makerjs from 'makerjs'

const wheelZoomDelta = 0.1
const p = makerjs.point

export default (state: RootState, action: ActionType) => {
    switch (action.type) {
        case 'TOGGLE_FIT_SCREEN':
            const newFitOnScreen = !state.options.fitOnScreen
            const newViewOptions = newFitOnScreen ? { ...state.view, scale: 1 } : state.view
            return {
                view: newViewOptions,
                options: { ...state.options, fitOnScreen: newFitOnScreen }
            }
        case 'TOGGLE_GRID':
            return {
                ...state,
                options: { ...state.options, showGrid: !state.options.showGrid }
            }
        case 'TOGGLE_PATH_NAMES':
            return {
                ...state,
                options: { ...state.options, showPathNames: !state.options.showPathNames }
            }
        case 'TOGGLE_PATH_FLOW':
            return {
                ...state,
                options: { ...state.options, showPathFlow: !state.options.showPathFlow }
            }
        case 'SET_VIEW_OFFSET':
            return {
                ...state,
                view: { ...state.view, viewOffset: action.point }
            }
        case 'MOUSE_WHEEL':
            var sign = action.delta > 0 ? 1 : -1
            var newScale = state.view.scale * (1 + sign * wheelZoomDelta)
            const newOptions = state.options.fitOnScreen && newScale !== 1 ? { ...state.options, fitOnScreen: false } : state.options
            return {
                options: newOptions,
                view: { ...state.view, scale: newScale }
            }
        case 'MOUSE_DOWN':
            return { ...state, view: { ...state.view, isMouseDown: true }
        }
        case 'MOUSE_UP':
            return { ...state, view: { ...state.view, isMouseDown: false }
        }
        case 'MOUSE_MOVE':
            const { view } = state
            const newCursor = p.subtract(action.point, view.viewOffset)
            var panDelta: makerjs.IPoint = [0, 0]
            if (state.view.isMouseDown) panDelta = p.subtract(newCursor, view.cursor) 
            return {
                ...state,
                view: { ...view, cursor: newCursor, panOffset: p.add(panDelta, view.panOffset) }
            }
        default:
            return state
    }
}