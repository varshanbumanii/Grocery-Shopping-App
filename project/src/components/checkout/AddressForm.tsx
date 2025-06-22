import { useForm } from 'react-hook-form';
import { Address } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AddressFormProps {
  defaultAddress?: Address;
  onSubmit: (data: Address) => void;
  isLoading?: boolean;
}

function AddressForm({ defaultAddress, onSubmit, isLoading = false }: AddressFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Address>({
    defaultValues: defaultAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="street"
        label="Street Address"
        placeholder="Enter your street address"
        {...register('street', { required: 'Street address is required' })}
        error={errors.street?.message}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="city"
          label="City"
          placeholder="Enter your city"
          {...register('city', { required: 'City is required' })}
          error={errors.city?.message}
        />
        
        <Input
          id="state"
          label="State/Province"
          placeholder="Enter your state"
          {...register('state', { required: 'State is required' })}
          error={errors.state?.message}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="zipCode"
          label="ZIP/Postal Code"
          placeholder="Enter your ZIP code"
          {...register('zipCode', { required: 'ZIP code is required' })}
          error={errors.zipCode?.message}
        />
        
        <Input
          id="country"
          label="Country"
          placeholder="Enter your country"
          {...register('country', { required: 'Country is required' })}
          error={errors.country?.message}
        />
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
        >
          Save Address
        </Button>
      </div>
    </form>
  );
}

export default AddressForm;