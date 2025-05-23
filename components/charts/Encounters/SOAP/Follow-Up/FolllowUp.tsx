import React from 'react'
import FollowUpDialog from './FollowUpDialog'
import { UserEncounterData } from '@/types/chartsInterface'
import ViewFollowUps from './ViewFollowUps'


const FolllowUp = ({patientDetails, encounterId}: {patientDetails: UserEncounterData, encounterId: string }) => {
    return (
        <div className='flex justify-between border-b pb-3'>
            <div>Follow Up</div>
            <div className="flex h-5 items-center space-x-4 text-sm">
                <FollowUpDialog patientDetails={patientDetails} encounterId={encounterId}/>
                <ViewFollowUps patientDetails={patientDetails}/>
            </div>
        </div>
    )
}

export default FolllowUp