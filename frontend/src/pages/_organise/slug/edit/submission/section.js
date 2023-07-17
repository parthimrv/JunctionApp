// Section.js
import React, { useState } from 'react'
import { Field } from 'formik'
import TextInput from './components/inputs/TextInput'
import FileInput from './components/inputs/FileInput'
import UrlInput from './components/inputs/UrlInput'
import EditableOptions from './components/EditableOptions'
import EditableText from './components/section/EditableText'
import Dropdown from './components/section/Dropdown'
import RemoveButton from './components/section/RemoveButton'
import BooleanInput from './components/inputs/BooleanInput'
import Switch from './components/Switch'

const Section = ({ onRemove, fieldName, onChange, ...props }) => {
    const [checked, setChecked] = React.useState(false)
    const [dropdownValue, setDropdownValue] = React.useState('option1')
    const [heading, setHeading] = React.useState('Heading')
    const [subHeading, setSubHeading] = React.useState('Sub Heading')

    const [booleanChecked, setBooleanChecked] = React.useState(false)

    const handleBooleanChange = event => {
        setBooleanChecked(event.target.checked)
    }

    const [singleChoiceOptions, setSingleChoiceOptions] = useState([
        'Option 1',
        'Option 2',
        'Option 3',
    ])
    const [multiChoiceOptions, setMultiChoiceOptions] = useState([
        'Option 1',
        'Option 2',
        'Option 3',
    ])

    const inputConfig = {
        text: {
            component: TextInput,
            placeholder: 'Placeholder',
        },
        file: {
            component: FileInput,
            placeholder: 'Placeholder',
        },
        url: {
            component: UrlInput,
            placeholder: 'Placeholder',
        },
        boolean: {
            component: BooleanInput,
            checked: booleanChecked,
            onChange: handleBooleanChange,
        },
        singleChoice: {
            component: EditableOptions,
            options: singleChoiceOptions,
            handleAddOption: option => {
                setSingleChoiceOptions([...singleChoiceOptions, option])
            },
            handleEdit: (index, option) => {
                const newOptions = singleChoiceOptions.slice()
                newOptions[index] = option
                setSingleChoiceOptions(newOptions)
            },
            handleDelete: index => {
                const newOptions = singleChoiceOptions.slice()
                newOptions.splice(index, 1)
                setSingleChoiceOptions(newOptions)
            },
        },
        multiChoice: {
            component: EditableOptions,
            options: multiChoiceOptions,
            handleAddOption: option => {
                setMultiChoiceOptions([...multiChoiceOptions, option])
            },
            handleEdit: (index, option) => {
                const newOptions = multiChoiceOptions.slice()
                newOptions[index] = option
                setMultiChoiceOptions(newOptions)
            },
            handleDelete: index => {
                const newOptions = multiChoiceOptions.slice()
                newOptions.splice(index, 1)
                setMultiChoiceOptions(newOptions)
            },
        },
    }

    const renderInput = dropdownValue => {
        const inputProps = inputConfig[dropdownValue]
        if (!inputProps) return null

        const InputComponent = inputProps.component
        delete inputProps.component

        return (
            <Field name={fieldName}>
                {({ field, form }) => (
                    <InputComponent
                        {...inputProps}
                        {...field}
                        onChange={e => {
                            form.setFieldValue(fieldName, e.target.value)
                            if (inputProps.onChange)
                                inputProps.onChange(e.target.value)
                        }}
                        onBlur={form.handleBlur}
                    />
                )}
            </Field>
        )
    }

    return (
        <div className="tw-p-4 tw-bg-white tw-rounded-lg tw-shadow-md">
            <div className="tw-flex tw-flex-col">
                <EditableText
                    value={heading}
                    save={value => {
                        setHeading(value)
                        onChange()
                    }}
                    className="tw-text-xl tw-font-bold tw-text-gray-800 tw-my-1"
                    type="heading"
                />
                <EditableText
                    value={subHeading}
                    save={value => {
                        setSubHeading(value)
                        onChange()
                    }}
                    className="tw-text-gray-500 tw-italic tw-my-1"
                    type=""
                />
                <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-gap-4 tw-justify-between">
                    <div className="tw-w-full sm:tw-w-4/5 tw-flex tw-flex-col tw-gap-4">
                        {renderInput(dropdownValue)}
                        <Switch
                            onChange={setChecked}
                            checked={checked}
                            checkedText="Yes"
                            uncheckedText="No"
                        />
                    </div>
                    <div className="tw-w-full sm:tw-w-1/5 tw-flex tw-flex-col tw-gap-4">
                        <Dropdown
                            value={dropdownValue}
                            onChange={setDropdownValue}
                            placeholder="Input type"
                            options={[
                                { value: 'text', label: 'Text' },
                                { value: 'file', label: 'File' },
                                { value: 'url', label: 'URL' },
                                { value: 'boolean', label: 'Boolean' },
                                {
                                    value: 'singleChoice',
                                    label: 'Single Choice',
                                },
                                { value: 'multiChoice', label: 'Multi Choice' },
                            ]}
                        />

                        <RemoveButton onRemove={onRemove} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Section
