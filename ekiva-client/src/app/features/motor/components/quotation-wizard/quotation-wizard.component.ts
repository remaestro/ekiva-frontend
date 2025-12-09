import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MotorService } from '../../../../core/services/motor.service';
import { ReferenceDataService } from '../../../../core/services/reference-data.service';
import { ClientService } from '../../../../core/services/client.service';
import { 
  CreateMotorQuoteRequest, 
  PremiumCalculationRequest,
  PremiumCalculationResult,
  MotorProduct,
  MotorCoverage
} from '../../../../core/models/motor.model';
import { Currency, VehicleCategory, VehicleMake } from '../../../../core/models/reference-data.model';

@Component({
  selector: 'app-quotation-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quotation-wizard.component.html'
})
export class QuotationWizardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private motorService = inject(MotorService);
  private refDataService = inject(ReferenceDataService);
  private clientService = inject(ClientService);
  private router = inject(Router);

  currentStep = signal(1);
  totalSteps = 5;
  currentYear = new Date().getFullYear(); // Add this property for template
  
  // Form
  quoteForm!: FormGroup;
  
  // Reference Data
  clients = signal<any[]>([]);
  motorProducts = signal<MotorProduct[]>([]);
  motorCoverages = signal<MotorCoverage[]>([]);
  vehicleCategories = signal<VehicleCategory[]>([]);
  vehicleMakes = signal<VehicleMake[]>([]);
  vehicleModels = signal<any[]>([]);
  currencies = signal<Currency[]>([]);
  
  // Premium Calculation
  premiumCalculation = signal<PremiumCalculationResult | null>(null);
  isCalculating = signal(false);
  
  // UI State
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.initForm();
    this.loadReferenceData();
  }

  private initForm() {
    this.quoteForm = this.fb.group({
      // Step 1: Client & Product
      clientId: ['', Validators.required],
      distributorId: [''],
      motorProductId: ['', Validators.required],
      
      // Step 2: Period
      policyStartDate: ['', Validators.required],
      policyEndDate: ['', Validators.required],
      durationMonths: [12, [Validators.required, Validators.min(1), Validators.max(12)]],
      
      // Step 3: Vehicle
      vehicleCategoryId: ['', Validators.required],
      vehicleMakeId: ['', Validators.required],
      vehicleModelId: ['', Validators.required],
      registrationNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      chassisNumber: ['', Validators.required],
      yearOfManufacture: [new Date().getFullYear(), [Validators.required, Validators.min(1990)]],
      horsepower: ['', [Validators.required, Validators.min(4), Validators.max(30)]],
      fuelType: ['Essence', Validators.required],
      vehicleValue: ['', [Validators.required, Validators.min(1000000)]],
      
      // Step 4: Coverages & Discounts
      selectedCoverageIds: [[], Validators.required],
      professionalDiscountPercent: [0, [Validators.min(0), Validators.max(20)]],
      commercialDiscountPercent: [0, [Validators.min(0), Validators.max(10)]],
      
      // Step 5: Currency & Notes
      currencyId: ['', Validators.required],
      notes: ['']
    });

    // Auto-calculate dates
    this.quoteForm.get('policyStartDate')?.valueChanges.subscribe(startDate => {
      if (startDate) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setMonth(end.getMonth() + (this.quoteForm.get('durationMonths')?.value || 12));
        this.quoteForm.patchValue({ policyEndDate: end.toISOString().split('T')[0] }, { emitEvent: false });
      }
    });

    this.quoteForm.get('durationMonths')?.valueChanges.subscribe(months => {
      const startDate = this.quoteForm.get('policyStartDate')?.value;
      if (startDate && months) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setMonth(end.getMonth() + months);
        this.quoteForm.patchValue({ policyEndDate: end.toISOString().split('T')[0] }, { emitEvent: false });
      }
    });

    // Load vehicle models when make changes
    this.quoteForm.get('vehicleMakeId')?.valueChanges.subscribe(makeId => {
      if (makeId) {
        this.loadVehicleModels(makeId);
      }
    });
  }

  private loadReferenceData() {
    // Load Clients - Fix: use getAllClients or similar method
    // Temporarily comment out until we know the correct method name
    // this.clientService.getClients().subscribe({
    //   next: (data: any) => this.clients.set(data),
    //   error: (err: any) => console.error('Error loading clients:', err)
    // });

    // Mock clients for now
    this.clients.set([
      { id: 'client-1', fullName: 'Jean Dupont', email: 'jean@example.com' },
      { id: 'client-2', companyName: 'SARL TECH', email: 'contact@tech.com' }
    ]);

    // Load Motor Products (mock for now - you need to add backend endpoint)
    this.motorProducts.set([
      { id: 'motor-tpo', productCode: 'MOTOR_TPO', productName: 'Au Tiers', description: 'RC uniquement', isActive: true },
      { id: 'motor-tpft', productCode: 'MOTOR_TPFT', productName: 'Tiers + Vol & Incendie', description: 'RC + Vol + Incendie', isActive: true },
      { id: 'motor-comp', productCode: 'MOTOR_COMP', productName: 'Tous Risques', description: 'Toutes garanties', isActive: true }
    ]);

    // Load Motor Coverages (mock for now - you need to add backend endpoint)
    this.motorCoverages.set([
      { id: 'cov-a', coverageCode: 'SECTION_A', coverageName: 'Responsabilité Civile', sectionLetter: 'A', fixedPremium: 0, isMandatory: true, description: 'Dommages causés aux tiers', isActive: true },
      { id: 'cov-b', coverageCode: 'SECTION_B', coverageName: 'Défense et Recours', sectionLetter: 'B', fixedPremium: 5000, isMandatory: false, description: 'Frais de défense juridique', isActive: true },
      { id: 'cov-c', coverageCode: 'SECTION_C', coverageName: 'Incendie', sectionLetter: 'C', fixedPremium: 0, isMandatory: false, description: 'Dommages par incendie', isActive: true },
      { id: 'cov-d', coverageCode: 'SECTION_D', coverageName: 'Vol', sectionLetter: 'D', fixedPremium: 0, isMandatory: false, description: 'Vol du véhicule', isActive: true },
      { id: 'cov-e', coverageCode: 'SECTION_E', coverageName: 'Bris de Glace', sectionLetter: 'E', fixedPremium: 5000, isMandatory: false, description: 'Vitres et pare-brise', isActive: true },
      { id: 'cov-f', coverageCode: 'SECTION_F', coverageName: 'Dommages Collision', sectionLetter: 'F', fixedPremium: 0, isMandatory: false, description: 'Dommages au véhicule assuré', isActive: true }
    ]);

    // Load Vehicle Categories
    this.refDataService.getVehicleCategories().subscribe({
      next: (data) => this.vehicleCategories.set(data),
      error: (err) => console.error('Error loading vehicle categories:', err)
    });

    // Load Vehicle Makes
    this.refDataService.getVehicleMakes().subscribe({
      next: (data) => this.vehicleMakes.set(data),
      error: (err) => console.error('Error loading vehicle makes:', err)
    });

    // Load Currencies
    this.refDataService.getCurrencies().subscribe({
      next: (data) => {
        this.currencies.set(data);
        // Set default currency to XOF
        const xof = data.find(c => c.code === 'XOF');
        if (xof) {
          this.quoteForm.patchValue({ currencyId: xof.id });
        }
      },
      error: (err) => console.error('Error loading currencies:', err)
    });
  }

  private loadVehicleModels(makeId: string) {
    // TODO: Add backend endpoint for vehicle models by make
    // For now, mock data
    this.vehicleModels.set([
      { id: 'model-1', name: 'Corolla', makeId },
      { id: 'model-2', name: 'RAV4', makeId },
      { id: 'model-3', name: 'Hilux', makeId }
    ]);
  }

  nextStep() {
    if (this.currentStep() < this.totalSteps) {
      // Validate current step before moving
      if (this.isStepValid(this.currentStep())) {
        this.currentStep.update(step => step + 1);
        
        // Calculate premium when reaching step 5
        if (this.currentStep() === 5) {
          this.calculatePremium();
        }
      } else {
        this.errorMessage.set('Veuillez remplir tous les champs requis');
      }
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
      this.errorMessage.set(null);
    }
  }

  private isStepValid(step: number): boolean {
    const form = this.quoteForm;
    
    switch (step) {
      case 1:
        return !!(form.get('clientId')?.valid && form.get('motorProductId')?.valid);
      case 2:
        return !!(form.get('policyStartDate')?.valid && form.get('policyEndDate')?.valid && form.get('durationMonths')?.valid);
      case 3:
        return !!(form.get('vehicleCategoryId')?.valid && 
               form.get('vehicleMakeId')?.valid && 
               form.get('vehicleModelId')?.valid &&
               form.get('registrationNumber')?.valid &&
               form.get('chassisNumber')?.valid &&
               form.get('yearOfManufacture')?.valid &&
               form.get('horsepower')?.valid &&
               form.get('fuelType')?.valid &&
               form.get('vehicleValue')?.valid);
      case 4:
        return !!(form.get('selectedCoverageIds')?.value?.length > 0);
      default:
        return true;
    }
  }

  calculatePremium() {
    if (!this.quoteForm.valid) return;

    this.isCalculating.set(true);
    this.errorMessage.set(null);

    const formValue = this.quoteForm.value;
    const request: PremiumCalculationRequest = {
      vehicleValue: formValue.vehicleValue,
      horsepower: formValue.horsepower,
      fuelType: formValue.fuelType,
      durationMonths: formValue.durationMonths,
      selectedCoverageIds: formValue.selectedCoverageIds,
      professionalDiscountPercent: formValue.professionalDiscountPercent || 0,
      commercialDiscountPercent: formValue.commercialDiscountPercent || 0,
      currencyId: formValue.currencyId,
      distributorId: formValue.distributorId
    };

    this.motorService.calculatePremium(request).subscribe({
      next: (result) => {
        this.premiumCalculation.set(result);
        this.isCalculating.set(false);
      },
      error: (err) => {
        console.error('Error calculating premium:', err);
        this.errorMessage.set('Erreur lors du calcul de la prime');
        this.isCalculating.set(false);
      }
    });
  }

  submitQuote() {
    if (!this.quoteForm.valid) {
      this.errorMessage.set('Veuillez remplir tous les champs requis');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.quoteForm.value;
    const request: CreateMotorQuoteRequest = {
      clientId: formValue.clientId,
      distributorId: formValue.distributorId,
      motorProductId: formValue.motorProductId,
      policyStartDate: formValue.policyStartDate,
      policyEndDate: formValue.policyEndDate,
      durationMonths: formValue.durationMonths,
      vehicleCategoryId: formValue.vehicleCategoryId,
      vehicleMakeId: formValue.vehicleMakeId,
      vehicleModelId: formValue.vehicleModelId,
      registrationNumber: formValue.registrationNumber,
      chassisNumber: formValue.chassisNumber,
      yearOfManufacture: formValue.yearOfManufacture,
      horsepower: formValue.horsepower,
      fuelType: formValue.fuelType,
      vehicleValue: formValue.vehicleValue,
      selectedCoverageIds: formValue.selectedCoverageIds,
      professionalDiscountPercent: formValue.professionalDiscountPercent || 0,
      commercialDiscountPercent: formValue.commercialDiscountPercent || 0,
      currencyId: formValue.currencyId,
      notes: formValue.notes
    };

    this.motorService.createQuote(request).subscribe({
      next: (response) => {
        console.log('Quote created successfully:', response);
        this.isSubmitting.set(false);
        // Navigate to quote details page
        this.router.navigate(['/motor/quotes', response.id]);
      },
      error: (err) => {
        console.error('Error creating quote:', err);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la création du devis');
        this.isSubmitting.set(false);
      }
    });
  }

  onCoverageToggle(coverageId: string, event: any) {
    const selectedIds = this.quoteForm.get('selectedCoverageIds')?.value as string[];
    
    if (event.target.checked) {
      this.quoteForm.patchValue({ 
        selectedCoverageIds: [...selectedIds, coverageId] 
      });
    } else {
      this.quoteForm.patchValue({ 
        selectedCoverageIds: selectedIds.filter(id => id !== coverageId) 
      });
    }

    // Recalculate premium if on step 5
    if (this.currentStep() === 5) {
      this.calculatePremium();
    }
  }

  isCoverageSelected(coverageId: string): boolean {
    const selectedIds = this.quoteForm.get('selectedCoverageIds')?.value as string[];
    return selectedIds.includes(coverageId);
  }

  isCoverageMandatory(coverage: MotorCoverage): boolean {
    return coverage.isMandatory;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getSelectedProductDescription(): string {
    const productId = this.quoteForm.get('motorProductId')?.value;
    if (!productId) return '';
    const product = this.motorProducts().find(p => p.id === productId);
    return product?.description || '';
  }
}
