import React from 'react'
import styles from './patient.module.css'

const PatientLabelDetails = ({label, value}: {label: string, value: string}) => {
    return (
        <div className='flex flex-row'>
            <div className={styles.labelText}>{label}</div>
            <div className={styles.valueText}>
                {value}
            </div>
        </div>
    )
}

export default PatientLabelDetails;