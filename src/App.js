import React, { Component } from 'react';
import sortBy from 'lodash/sortBy';
import './App.css';

const generateTimes = () => {
  let increment = 0;
  const timesArray = [];
  for (let i = 0; i <= 24; i++) {
    const testNum = convertNumToTime(increment);
    timesArray.push(testNum);
    increment += 30;
  };
  return timesArray;
}

const convertNumToTime = (num) => {
  let hour = 9;
  let minute = 0;
  const remainder = (num % 60)/100;
  const quotient = Math.floor(num / 60);
  minute += remainder
  minute = `${Number(minute).toFixed(2)}`;
  minute = minute.split('.')[1];
  hour = convertTimeFormat(hour += quotient);
  return convertTimeToString({ hour, minute });
}

const convertTimeFormat = (hour) =>
  (hour > 12) ? (hour - 12) : hour;

const convertTimeToString = ({ hour, minute }) => {
  return `${hour}:${minute}`;
}

const displayEvent = ({start, end, index}) => {
  const eventHeight = end - start;
  return (
    <div key={`${index}eventIndex`} style={{
      marginTop: start,
      height: eventHeight,
      background: '#fff',
      border: '1px solid #ddd',
      width: '100%',
      display: 'flex',
      minWidth: 0,
      overflowWrap: 'break-word',
      }}>
      <div style={{
        height: eventHeight,
        margin: 0,
        width: 5,
        background: '#4b6da8',
        minWidth: 0,
        whiteSpace: 'wrap',
        overflowWrap: 'break-word',
      }}>
      </div>
      <div style={{
        margin: '5px 0 0 10px',
        minWidth: 0,
        whiteSpace: 'wrap',
        overflowWrap: 'break-word',
      }}>
        <div style={{
          color: '#4b6da8',
          fontSize: 10,
          fontWeight: 'bold',
        }}>Sample Item</div>
        <div style={{
          color: '#777',
          fontSize: 8,
        }}>Sample Location</div>
      </div>
    </div>
  )
}

const groupEvents = (events) => {
  const groups = [];
  events && events.forEach((each, key) => {
    if (key === 0) {
      groups.push([each]);
    } else {
      const { start } = each;
      let pushToGroup;
      let pushToNextIndex;
      groups && groups.forEach((sortGroup, sortGroupIndex) => {
        sortGroup && sortGroup.forEach((groupItem) => {
          const { start: previousStart, end: previousEnd } = groupItem;
          (start >= previousStart && start <= previousEnd)
            ? pushToGroup = each
            : pushToNextIndex = sortGroupIndex + 1;
        });
        (pushToGroup !== undefined)
          ? sortGroup.push(pushToGroup)
          : !groups[pushToNextIndex] && groups.push([each]);
      });
    }
  });
  return groups;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    }
    this.layOutDay = this.layOutDay.bind(this);
  }

  componentWillMount() {
    window.layOutDay = this.layOutDay;
  }

  layOutDay(layouts) {
    const sortedEvents = sortBy(layouts, ['start']);
    const groupedEvents = groupEvents(sortedEvents);
    this.setState({
      events: groupedEvents && groupedEvents.map((groups, groupIndex) => {
        return groups && (
          <div key={`${groupIndex}eventGroupIndex`} className="event-group"> {
            groups.map((event, index) => {
              return displayEvent({...event, index});
            })
          }</div>
        )
      })
    })
  }

  render() {
    const test = generateTimes();
    const { events } = this.state;
    return (
      <div className="calender-app">
        <div className="calender-time">
        {
          test.map((each, key) => {
            const fullHour = !!(key % 2 === 0);
            return (
              <div key={`${key}timeIndex`} className="individual-time">
                <div className={`${fullHour ? 'full-hour' : 'half-hour'}`}>{each}</div>
                {fullHour && <div className="day-container">AM</div>}
              </div>
            )
          })
        }
        </div>
        <div className="calender-container">
          {events}
        </div>
      </div>
    );
  }
}

export default App;
