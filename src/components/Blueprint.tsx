/**
 * @className Blueprint
 */

import * as React from 'react'
const { useState, useEffect, useRef } = React
import convert from 'react-from-dom';
import Grid from './Grid'
import Statusbar from './Statusbar'
import OptionsMenu from './OptionsMenu'
import styles from './Blueprint.css'
import { useTranslation } from "react-i18next";
import { store, dispatchStore } from '../store';
import Pointers from './Pointers';

export type Props = { svg: string }

interface SVGProps {
  width: string
  height: string
  viewBox: string
  xmlns: string
  children: any[]
}

const Blueprint = ({ svg }: Props) => {
  const { options, view } = React.useContext(store)
  const dispatch = React.useContext(dispatchStore)

  const [measurement] = useState("units");
  const [isExpanded, setIsExpanded] = useState(false);
  const [svgNode, setSVGNode] = useState<React.ReactElement<SVGProps, any>>()
  const { t } = useTranslation()
 
  const svgStyle = {
    marginLeft: view.panOffset[0],
    marginTop: view.panOffset[1]
  }

  const width = 100 * view.scale
  const height = 100 * view.scale

  console.log("Rerendering Blueprint")

  const mainViewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    var svgNode = convert(svg) as React.ReactElement<SVGProps, any>
    setSVGNode(svgNode)
  }, [svg])

  useEffect(() => {
    if (mainViewRef.current) {
      let boundingBox = mainViewRef.current.getBoundingClientRect()
      dispatch({ type: 'SET_VIEW_OFFSET', point: [boundingBox.left, boundingBox.top]})
    }
  }, [mainViewRef])

  return <>
    <header>
      <div className={`${styles.renderingOptionsTop} ${!isExpanded ? styles.collapsedRenderingOptionsTop : ""}`}>
        <button className={styles.renderOptionsButton} onClick={() => setIsExpanded(!isExpanded)}>{t("blueprint.renderingOptions")} {isExpanded ? "▴" : "▾"}</button>
      </div>
    </header>

    <section className={styles.blueprintCanvas} >
      {options.showGrid ? <Grid /> : null}

      <div
        className={styles.viewParams}
        onMouseDown= {() => dispatch({ type: 'MOUSE_DOWN' })}
        onMouseMove={(e) => { e.persist(); dispatch({ type: 'MOUSE_MOVE', point: [e.clientX, e.clientY] })} }
        onMouseUp= {() => dispatch({ type: 'MOUSE_UP' })}
        onWheel={(e) => dispatch({ type: 'MOUSE_WHEEL', delta: e.deltaY })}
      >
        <div ref={mainViewRef} className={`${styles.view} noselect`} touch-action="none">
          <div id="view-svg-container">
            {svgNode ? <svg {...svgNode.props} width={width} height={height} style={svgStyle} /> : null}
          </div>
          {view.isMouseDown ? <Pointers /> : null}
          <div className={styles.touchShield}></div>
        </div>
        {isExpanded ? <OptionsMenu measurement={measurement} /> : null}  
      </div>

      <Statusbar />

    </section>
  </>
}

export default Blueprint