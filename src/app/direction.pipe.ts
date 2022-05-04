import { Pipe, PipeTransform } from '@angular/core';

const rotates: Record<"S" | "W" | "NNE" | "NE" | "ENE" | "E" | "ESE" | "SE" | "SSE" | "SSW" | "SW" | "WSW" | "WNW" | "NW" | "NNW" | "N", string> = {
  N: 'rotateZ(-90deg)',
  NNE: 'rotateZ(-66deg)',
  NE: 'rotateZ(-45deg)',
  ENE: 'rotateZ(-22deg)',
  E: 'rotateZ(0deg)',
  ESE: 'rotateZ(22deg)',
  SE: 'rotateZ(45deg)',
  SSE: 'rotateZ(67deg)',
  S: 'rotateZ(90deg)',
  SSW: 'rotateZ(112deg)',
  SW: 'rotateZ(135deg)',
  WSW: 'rotateZ(157deg)',
  W: 'rotateZ(180deg)',
  WNW: 'rotateZ(202deg)',
  NW: 'rotateZ(225deg)',
  NNW: 'rotateZ(247deg)',
}
@Pipe({
  name: 'direction'
})
export class DirectionPipe implements PipeTransform {

  transform(value: "S" | "W" | "NNE" | "NE" | "ENE" | "E" | "ESE" | "SE" | "SSE" | "SSW" | "SW" | "WSW" | "WNW" | "NW" | "NNW" | "N"): unknown {
    return rotates[value] ?? 'rotateZ(0deg)';
  }

}
