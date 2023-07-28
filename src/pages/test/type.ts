

type Diversity = {
    label: string,
    id: string
}

type Contact = {
    type: 'email' | 'phone' | 'website' | 'other',
    value: string
}

export interface Person {
    name: string,
    diversities: Diversity[],
    office: string,
    area: string,
    job: string,
    jobDescription: string,
    city: string,
    state: string,
    contacts: Contact[]
}