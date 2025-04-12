import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";



@Entity()
export class AdminProESPEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 100 })
  password!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 100 })
  emailTk!: string;

  @Column({ type: "varchar", length: 100 })
  lasteUpdatePassword!: string;
}
