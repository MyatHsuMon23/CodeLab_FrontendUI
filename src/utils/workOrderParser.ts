// src/utils/workOrderParser.ts

import { 
  WorkOrderCommand, 
  ParsedWorkOrder, 
  WORK_ORDER_TYPES, 
  VALID_PBB_ANGLES, 
  PBBAngle 
} from '@type/flight.types';

export class WorkOrderParser {
  static parseCommand(commandString: string): ParsedWorkOrder {
    const result: ParsedWorkOrder = {
      originalCommand: commandString.trim(),
      commands: [],
      isValid: true,
      errors: []
    };

    if (!commandString.trim()) {
      result.isValid = false;
      result.errors.push('Command string cannot be empty');
      return result;
    }

    // Split by | and process each command
    const parts = commandString.split('|').map(part => part.trim()).filter(part => part.length > 0);
    
    if (parts.length === 0) {
      result.isValid = false;
      result.errors.push('No valid commands found');
      return result;
    }

    for (const part of parts) {
      const command = this.parseCommandPart(part);
      result.commands.push(command);
      
      if (!command.isValid) {
        result.isValid = false;
      }
    }

    // Check for duplicate command types
    const commandTypes = result.commands.map(cmd => cmd.type);
    const duplicateTypes = commandTypes.filter((type, index) => commandTypes.indexOf(type) !== index);
    
    if (duplicateTypes.length > 0) {
      result.isValid = false;
      result.errors.push(`Duplicate command types found: ${duplicateTypes.join(', ')}`);
    }

    return result;
  }

  private static parseCommandPart(part: string): WorkOrderCommand {
    // Match pattern like CHK15, BAG25, CLEAN10, PBB90
    const match = part.match(/^([A-Z]+)(\d+)$/);
    
    if (!match) {
      return {
        type: 'CHK', // Default fallback
        value: 0,
        description: `Invalid command format: ${part}`,
        isValid: false
      };
    }

    const [, typeStr, valueStr] = match;
    const value = parseInt(valueStr, 10);

    // Validate command type
    if (!Object.keys(WORK_ORDER_TYPES).includes(typeStr)) {
      return {
        type: 'CHK', // Default fallback
        value,
        description: `Unknown command type: ${typeStr}`,
        isValid: false
      };
    }

    const type = typeStr as keyof typeof WORK_ORDER_TYPES;
    
    // Special validation for PBB (jet-bridge angle)
    if (type === 'PBB') {
      if (!VALID_PBB_ANGLES.includes(value as PBBAngle)) {
        return {
          type,
          value,
          description: `Invalid jet-bridge angle: ${value}° (must be ${VALID_PBB_ANGLES.join(', ')})`,
          isValid: false
        };
      }
    }

    // General value validation
    if (value < 0) {
      return {
        type,
        value,
        description: `Invalid negative value for ${WORK_ORDER_TYPES[type]}: ${value}`,
        isValid: false
      };
    }

    // Generate human-readable description
    let description: string;
    switch (type) {
      case 'CHK':
        description = `Check-in: ${value} minutes`;
        break;
      case 'BAG':
        description = `Baggage handling: ${value} minutes`;
        break;
      case 'CLEAN':
        description = `Cleaning: ${value} minutes`;
        break;
      case 'PBB':
        description = `Jet-bridge angle: ${value}°`;
        break;
      default:
        description = `${WORK_ORDER_TYPES[type]}: ${value}`;
    }

    return {
      type,
      value,
      description,
      isValid: true
    };
  }

  static validateCommandString(commandString: string): { isValid: boolean; errors: string[] } {
    const parsed = this.parseCommand(commandString);
    return {
      isValid: parsed.isValid,
      errors: parsed.errors
    };
  }

  static getCommandExamples(): string[] {
    return [
      'CHK15|BAG25|CLEAN10|PBB90',
      'CHK20|BAG30|CLEAN15',
      'PBB180|CLEAN5',
      'CHK10|BAG20|CLEAN8|PBB0',
      'BAG15|CLEAN12|PBB270'
    ];
  }

  static getCommandHelp(): { [key: string]: string } {
    return {
      CHK: 'Check-in minutes (CHKn) - Time allocated for passenger check-in',
      BAG: 'Baggage minutes (BAGn) - Time allocated for baggage handling',
      CLEAN: 'Cleaning minutes (CLEANn) - Time allocated for aircraft cleaning',
      PBB: 'Jet-bridge angle (PBBx) - Angle for jet-bridge positioning (0, 90, 180, or 270 degrees only)'
    };
  }
}