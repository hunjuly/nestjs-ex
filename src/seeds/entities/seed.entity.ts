import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Seed {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}

/*
Q: typeorm의 코드는 infrastructure 레이어에 포함되는거 아니야?
DDD에서는 도메인 레이어와 infrastructure 레이어를 구분하게 되어있는데 entities가 왜 domain 폴더의 하위에 있지?

A: 일반적으로, DDD에서 도메인 레이어는 도메인의 핵심 비즈니스 로직과 개념을 포함하고,
인프라스트럭처 레이어는 도메인의 구현을 위한 기술적 세부 사항을 다룹니다.

TypeORM과 같은 ORM 프레임워크를 사용할 때, entity는 도메인 객체의 구현에 필요한 기술적 세부 사항을 포함합니다.
그러나 entity는 여전히 도메인 모델의 일부이므로 도메인 레이어에서 구현되어야합니다.

즉, entities가 domain 폴더의 하위 폴더에 위치하는 것은 일반적인 구조입니다.
이러한 구조를 사용하면 도메인과 구현 사이의 경계를 유지하면서 도메인 모델과 데이터베이스 스키마 간의 매핑을 쉽게 할 수 있습니다.

마찬가지로, 서비스는 도메인 객체를 조작하고 도메인 로직을 캡슐화하기 때문에 도메인 레이어에 위치하는 것이 일반적입니다.
이렇게 하면 서비스가 도메인 객체와 도메인 로직을 더 잘 캡슐화 할 수 있으며, 비즈니스 규칙의 변화에 대응하기 쉽습니다.
*/
