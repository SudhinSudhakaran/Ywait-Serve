/*
import React from 'react';
import LottieView from 'lottie-react-native';
import { Modal } from 'react-native';

export default class LoadingIndicator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          visible: this.props.visible,
        };
      }

    render() {
        return (
            <Modal
                animationType={this.props.animation}
                onRequestClose={() => this._handleOnRequestClose()}
                supportedOrientations={['landscape', 'portrait']}
                transparent
                visible={this.state.visible}
                statusBarTranslucent={true}
            >
                <LottieView source={require('../../../assets/animations/LoaderAnimationNew.json')} autoPlay loop />
            </Modal>
        );
    }
}
*/

import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {Colors, Images, Globals} from '../../../constants';
import {BUILD_SOURCE} from '../../../helpers/enums/Enums';

const transparent = 'transparent';
const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
  },
  background: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    backgroundColor: transparent,
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  textContainer: {
    alignItems: 'center',
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  textContent: {
    fontSize: 20,
    fontWeight: 'bold',
    height: 50,
    top: 60,
  },
});

const ANIMATION = ['none', 'slide', 'fade'];
const SIZES = ['small', 'normal', 'large'];

export default class LoadingIndicator extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      textContent: this.props.textContent,
    };
  }

  static propTypes = {
    cancelable: PropTypes.bool,
    color: PropTypes.string,
    animation: PropTypes.oneOf(ANIMATION),
    overlayColor: PropTypes.string,
    size: PropTypes.oneOf(SIZES),
    textContent: PropTypes.string,
    textStyle: PropTypes.object,
    visible: PropTypes.bool,
    indicatorStyle: PropTypes.object,
    customIndicator: PropTypes.element,
    children: PropTypes.element,
    spinnerKey: PropTypes.string,
  };

  static defaultProps = {
    visible: false,
    cancelable: false,
    textContent: '',
    animation: 'none',
    color: 'white',
    size: 'large', // 'normal',
    overlayColor: 'rgba(0, 0, 0, 0.25)',
  };

  close() {
    this.setState({visible: false});
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    if (state.visible !== props.visible) newState.visible = props.visible;
    if (state.textContent !== props.textContent)
      newState.textContent = props.textContent;
    return newState;
  }

  _handleOnRequestClose() {
    if (this.props.cancelable) {
      this.close();
    }
  }

  _renderDefaultContent() {
    return (
      <View style={styles.background}>
        {this.props.customIndicator ? (
          this.props.customIndicator
        ) : (
          <ActivityIndicator
            color={this.props.color}
            size={this.props.size}
            style={[styles.activityIndicator, {...this.props.indicatorStyle}]}
          />
        )}
        <View style={[styles.textContainer, {...this.props.indicatorStyle}]}>
          <Text style={[styles.textContent, this.props.textStyle]}>
            {this.state.textContent}
          </Text>
        </View>
      </View>
    );
  }

  _renderSpinner() {
    const spinner = (
      <View
        style={[styles.container, {backgroundColor: this.props.overlayColor}]}
        key={
          this.props.spinnerKey
            ? this.props.spinnerKey
            : `spinner_${Date.now()}`
        }>
        {this.props.children
          ? this.props.children
          : this._renderDefaultContent()}
      </View>
    );

    return (
      <Modal
        animationType={this.props.animation}
        onRequestClose={() => this._handleOnRequestClose()}
        supportedOrientations={['landscape', 'portrait']}
        transparent
        visible={this.state.visible}
        statusBarTranslucent={true}>
        {/* {spinner} */}
        <View
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#0004',
            justifyContent: 'center',
          }}>
          {Globals.CUSTOM_BUILD_SOURCE === BUILD_SOURCE.SKILLIKZ ? (
            <Image
              style={{
                height: 70,
                width: 70,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
              source={Images.SKILLIKZ_LOADER}
            />
          ) : (
            <LottieView
              style={{width: 70, height: 70, alignSelf: 'center'}}
              source={require('../../../assets/animations/LoaderAnimationNew.json')}
              colorFilters={[
                {
                  keypath: 'Shape Layer 1',
                  color: Colors.SECONDARY_COLOR,
                },
              ]}
              autoPlay
              loop
            />
          )}
        </View>
      </Modal>
    );
  }

  render() {
    return this._renderSpinner();
  }
}
