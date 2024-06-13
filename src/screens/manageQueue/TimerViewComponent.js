import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, I18nManager} from 'react-native';
import {Colors, Fonts, Translations} from '../../constants';
import moment from 'moment';
import {t} from 'i18next';
const TimerViewComponent = ({style, item, availabilityInfo,timestart}) => {
  const [timeText, setTimeText] = useState('');
  useEffect(() => {
    // console.log('item=======',item)
    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
     const timer=timeRemaining(item?.servingDate, moment(new Date()));
     if(availabilityInfo?.sessionInfo?.enableEndButton ===true){
    setTimeText(timer);
        return;
     }
     else{
      clearInterval(timer)
      return;
     }
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeText]);
  function timeRemaining(start, end) {
    // get unix seconds
    const began = moment(start).unix();
    const stopped = moment(end).unix();
    // find difference between unix seconds
    const difference = stopped - began;

    // apply to moment.duration
    const duration = moment.duration(difference, 'seconds');
    // then format the duration
    const h = duration.hours().toString().padStart(2, '0');
    const m = duration.minutes().toString().padStart(2, '0');
    const s = duration.seconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
    }

  return (
    <Text
      // ref={timerRef}
      style={style}>
      {timeText}
    </Text>
  );
};

export {TimerViewComponent};
