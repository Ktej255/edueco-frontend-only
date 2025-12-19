export interface Lead {
    id: number;
    name: string;
    email: string;
    phone?: string;
    status: 'NEW' | 'CONTACTED' | 'INTERESTED' | 'ENROLLED' | 'CLOSED' | 'JUNK';
    source_primary?: string;
    source_secondary?: string;
    source_tertiary?: string;
    assigned_to_id?: number;
    is_verified: boolean;
    verification_method?: 'EMAIL' | 'SMS' | 'WHATSAPP';
    intent_score: number;
    notes?: string;
    last_activity: string;
    created_at: string;
}

export interface LeadFilter {
    status?: string;
    source?: string;
    assigned_to?: number;
    date_from?: string;
    date_to?: string;
    search?: string;
}

export interface LeadStats {
    total: number;
    new_today: number;
    verified_percentage: number;
    conversion_rate: number;
}
