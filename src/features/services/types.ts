export interface Service {
  id: string;
  name: string;
  required_fields: {
    name: string;
    label: {
      en: string;
    };
    type: string;
    placeholder: {
      en: string;
    };
    max_length: number;
    validation?: string;
    validation_error_message?: {
      en: string;
    };
  }[];
}

export interface ServiceEntry {
  id: string;
  serviceId: string;
  serviceName: string;
  data: Record<string, any>;
  timestamp: string;
}

export interface FormData {
  [key: string]: string;
} 