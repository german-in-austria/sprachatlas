<template>
  <div style="margin-top: 10px">
    <v-container>
      <v-row>
        <v-col>
          <div id="datavis"></div>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col>
          <v-switch
            v-model="kontext"
            label="Kontext"
            color="info"
            @change="changeStyleOfGraph()"
            inset
          ></v-switch>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';

import * as d3 from 'd3';

@Component({
  components: {},
  name: 'ChartViewer'
})
export default class ChartViewer extends Vue {
  /*
  inputData = [
    {
      age: 23,
      color: '#00FF00',
      value: 23,
      group: 'jung(18-35) +matura',
      name: 'LVOK-',
      sigle: '0472'
    },
    {
      age: 23,
      color: '#FF0000',
      value: 120,
      group: 'jung(18-35) +matura',
      name: 'LVOK+',
      sigle: '0472'
    },
    {
      age: 64,
      color: '#FF0000',
      value: 20,
      group: 'alt(65+) -matura',
      name: 'LVOK+',
      sigle: '0120'
    }
  ];*/

  kontext: boolean = true;

  @Prop() readonly inputData!: Array<any>;

  get maxValue() {
    // get maximum value from inputData, based by value property
    return this.inputData.reduce((acc, cur) => {
      return acc.value > cur.value ? acc : cur;
    }).value;
  }

  get minValue() {
    return this.inputData.reduce((acc, cur) => {
      return acc.value < cur.value ? acc : cur;
    }).value;
  }

  get classes() {
    return new Set(this.inputData.map((el) => el.name));
  }

  get subgroups() {
    return new Set(this.inputData.map((el) => el.group));
  }

  get colors() {
    return new Set(this.inputData.map((el) => el.color));
  }

  drawGraph() {
    const margin = 60;
    const width = 400;
    const height = 500;
    const svg = d3
      .select('#datavis')
      .append('svg')
      .attr('width', width + margin + margin + 50)
      .attr('height', height + margin + margin)
      .append('g');

    const x = d3
      .scaleBand()
      .domain(this.kontext ? this.classes : this.subgroups)
      .range([margin, width - margin])
      .padding(0.1);
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    const y = d3
      .scaleLinear()
      .domain([0, 120])
      .range([height - margin, margin]);
    svg.append('g').call(d3.axisLeft(y));
    const color = d3
      .scaleOrdinal()
      .domain(this.kontext ? this.subgroups : this.classes)
      .range(this.colors);
    let keys;
    let data;
    if (this.kontext) {
      keys = d3.union(this.inputData.map((d) => d.group));
      data = d3.index(
        this.inputData,
        (d) => d.name,
        (d) => d.group
      );
    } else {
      keys = d3.union(this.inputData.map((d) => d.name));
      data = d3.index(
        this.inputData,
        (d) => d.group,
        (d) => d.name
      );
    }

    const stackedData = d3
      .stack()
      .keys(keys)
      .value(([, group], key) => {
        if (group.has(key)) {
          return group.get(key).value;
        } else {
          return 0;
        }
      })(data);
    const dataDiv = d3
      .select('#datavis')
      .append('div')
      .attr('class', 'tooltip-donut')
      .style('opacity', 0);

    svg
      .append('g')
      .selectAll('g')
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .join('g')
      //@ts-ignore
      .attr('fill', (d: any) => color(d.key))
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data((d) => d)
      .join('rect')
      .attr('x', (d) => x(d.data[0]))
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth())
      .on('mouseover', function (d, i) {
        d3.select(this).transition().duration(50).attr('opacity', '.85');
        dataDiv.transition().duration(50).style('opacity', 1);
        dataDiv
          .html(`${i[1] - i[0]}`)
          .style('left', d.pageX + 10 + 'px')
          .style('top', d.pageY - 15 + 'px');
      })
      .on('mouseout', function (d, i) {
        d3.select(this).transition().duration(50).attr('opacity', '1');
        dataDiv.transition().duration(50).style('opacity', 0);
      })
      .on('mousemove', function (d, i) {
        return dataDiv
          .style('top', d.pageY + 10 + 'px')
          .style('left', d.pageX - 15 + 'px');
      });
    svg
      .selectAll('mydots')
      .data(keys)
      .enter()
      .append('circle')
      .attr('cx', 400)
      .attr('cy', (d, i) => {
        return 100 + i * 25;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr('r', 7)
      .style('fill', (d) => color(d));

    svg
      .selectAll('mylabels')
      .data(keys)
      .enter()
      .append('text')
      .attr('x', 420)
      .attr('y', function (d, i) {
        return 105 + i * 25;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style('fill', function (d) {
        return color(d);
      })
      .text(function (d) {
        return d;
      })
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle');
  }

  changeStyleOfGraph() {
    d3.select('#datavis').select('svg').remove();
    this.drawGraph();
  }

  mounted() {
    this.drawGraph();
  }
}
</script>
<style lang="scss">
div.tooltip-donut {
  position: absolute;
  text-align: center;
  padding: 0.5rem;
  background: #ffffff;
  color: #313639;
  border: 1px solid #313639;
  border-radius: 8px;
  pointer-events: none;
  font-size: 1.3rem;
}
</style>
