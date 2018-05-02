import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import t from 'tcomb-form-native'
import Accordion from 'react-native-collapsible/Accordion'

const Select = t.form.Select

class AccordionPicker extends Select {
  _renderHeader (locals) {
    const valueText = locals.options.find(element => {
      return element.value === locals.value
    })
    let controlLabelStyle = locals.stylesheet.controlLabel.normal
    if (locals.hasError) {
      controlLabelStyle = locals.stylesheet.controlLabel.error
    }
    return (
      <View style={[styles.header, styles.textContainer]}>
        <Text style={[styles.label, controlLabelStyle]}>
          {locals.label}
        </Text>
        <Text style={[locals.stylesheet.controlLabel.normal, styles.value]}>
          {valueText.text}
        </Text>
      </View>
    )
  }

  _renderContent (locals) {
    return (
      <View>
        {t.form.Form.templates.select({...locals, label: null})}
      </View>
    )
  }

  getTemplate () {
    var self = this
    return function (locals) {
      return (
        <Accordion
          style={styles.container}
          sections={['Select']}
          renderHeader={self._renderHeader.bind(self, locals)}
          renderContent={self._renderContent.bind(self, locals)}
        />
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  textContainer: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
  },
  label: {
    fontSize: 16,
    alignSelf: 'center'
  },
  value: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    alignSelf: 'center',
    color: '#666'
  },
  header: {
    flex: 1,
    height: 44,
    backgroundColor: '#f9f9f9',
  },
})

export default AccordionPicker
