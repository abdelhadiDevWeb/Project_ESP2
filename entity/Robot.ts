import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";



@Entity()
export class Robot extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "boolean", default: true })
  stausWork!: boolean;

  @Column({ type: "boolean", default: true })
  statusSante!: boolean;


  @Column({ type: "text", array: true })
  location!: string[];

  @Column({ type: "boolean", default: true })
  start!: boolean;

  @Column({ type: "boolean", default: true })
  finich!: boolean;
}
